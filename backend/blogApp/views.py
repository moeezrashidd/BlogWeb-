from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import check_password, make_password
from django.contrib.auth import logout as django_logout
from django.contrib.auth.signals import user_logged_in

from .models import Users, Profiles, Posts, PostUserLike, PostImage
from .serializer import UserSerializer, PostsSerializer, ProfilesSerializer

@api_view(["GET", "POST"])
def users_view(request):
    if request.method == "GET":
        data = Users.objects.all()
        serializer = UserSerializer(data, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["GET", "POST"])
def posts_view(request):
    if request.method == "GET":
        data = Posts.objects.all().order_by('-created_at')
        serializer = PostsSerializer(data, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    serializer = PostsSerializer(data=request.data)
    if serializer.is_valid():
        post = serializer.save()
        images = request.FILES.getlist('images')
        for image in images:
            PostImage.objects.create(post=post, image=image)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["GET", "POST"])
def profiles_view(request):
    if request.method == "GET":
        data = Profiles.objects.all()
        serializer = ProfilesSerializer(data, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    serializer = ProfilesSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["POST"])
def follow_user(request):
    actor_id = request.data.get("actor_id")
    target_id = request.data.get("target_id")

    if not actor_id or not target_id:
        return Response(
            {"error": "actor_id and target_id are required"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if actor_id == target_id:
        return Response(
            {"error": "You cannot follow yourself"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        actor = Users.objects.get(id=actor_id)
        target = Users.objects.get(id=target_id)
    except Users.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    target.followers.add(actor)
    return Response({"message": "Successfully followed"}, status=status.HTTP_200_OK)

@api_view(["POST"])
def unfollow_user(request):
    actor_id = request.data.get("actor_id")
    target_id = request.data.get("target_id")

    if not actor_id or not target_id:
        return Response(
            {"error": "actor_id and target_id are required"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        actor = Users.objects.get(id=actor_id)
        target = Users.objects.get(id=target_id)
    except Users.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    target.followers.remove(actor)
    return Response(
        {"message": "Successfully unfollowed"},
        status=status.HTTP_200_OK,
    )

@api_view(["POST"])
def login_view(request):
    email = request.data.get("email")
    password = request.data.get("password")

    if not email or not password:
        return Response(
            {"error": "Email and password are required"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        user = Users.objects.get(email=email)

        if user.password and check_password(password, user.password):
            user_logged_in.send(sender=Users, instance=user, request=request)
            serializer = UserSerializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)

        if user.password == password:
            user.password = make_password(password)
            user.save(update_fields=["password"])
            user_logged_in.send(sender=Users, instance=user, request=request)
            serializer = UserSerializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response({"error": "Invalid password"}, status=status.HTTP_400_BAD_REQUEST)
    except Users.DoesNotExist:
        return Response(
            {"error": "User with this email does not exist"},
            status=status.HTTP_404_NOT_FOUND,
        )

@api_view(["POST"])
def logout_view(request):
    """
    Logout endpoint.
    Uses Django's built-in logout to clear cookies and flush session.
    """
    try:
        django_logout(request)
        return Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(["GET"])
def check_follow_status(request):
    actor_id = request.query_params.get("actor_id")
    target_id = request.query_params.get("target_id")

    if not actor_id or not target_id:
        return Response(
            {"error": "actor_id and target_id are required"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        actor = Users.objects.get(id=actor_id)
        target = Users.objects.get(id=target_id)
        is_following = target.followers.filter(id=actor.id).exists()
        return Response({"is_following": is_following}, status=status.HTTP_200_OK)
    except Users.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(["GET"])
def get_user_followers(request, user_id):
    try:
        user = Users.objects.get(id=user_id)
        followers = user.followers.all()
        profiles = Profiles.objects.filter(username__in=followers)
        serializer = ProfilesSerializer(profiles, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Users.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(["GET"])
def get_user_following(request, user_id):
    try:
        user = Users.objects.get(id=user_id)
        following = user.following.all()
        profiles = Profiles.objects.filter(username__in=following)
        serializer = ProfilesSerializer(profiles, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Users.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(["PUT"])
def update_profile(request, user_id):
    try:
        user = Users.objects.get(id=user_id)
        profile = Profiles.objects.get(username=user)
    except (Users.DoesNotExist, Profiles.DoesNotExist):
        return Response({"error": "User or Profile not found"}, status=status.HTTP_404_NOT_FOUND)

    name = request.data.get("name")
    if name:
        user.name = name
        user.save()

    serializer = ProfilesSerializer(profile, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["GET"])
def check_post_like(request):
    actor_id = request.query_params.get("actor_id")
    post_id = request.query_params.get("post_id")

    if not actor_id or not post_id:
        return Response(
            {"error": "actor_id and post_id are required"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        liked = PostUserLike.objects.filter(user_id=actor_id, post_id=post_id).exists()
        return Response({"is_liked": liked}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(["POST"])
def like_post(request):
    actor_id = request.data.get("actor_id")
    post_id = request.data.get("post_id")

    if not actor_id or not post_id:
        return Response(
            {"error": "actor_id and post_id are required"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        post = Posts.objects.get(id=post_id)
        user = Users.objects.get(id=actor_id)

        obj, created = PostUserLike.objects.get_or_create(user=user, post=post)
        if created:
            post.likes = post.likes + 1
            post.save(update_fields=["likes"])

            try:
                author_profile = Profiles.objects.get(username=post.username)
                author_profile.likes += 1
                author_profile.save(update_fields=["likes"])
            except Profiles.DoesNotExist:
                pass

        return Response({"message": "liked", "likes": post.likes}, status=status.HTTP_200_OK)
    except Posts.DoesNotExist:
        return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)
    except Users.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(["POST"])
def unlike_post(request):
    actor_id = request.data.get("actor_id")
    post_id = request.data.get("post_id")

    if not actor_id or not post_id:
        return Response(
            {"error": "actor_id and post_id are required"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        post = Posts.objects.get(id=post_id)
        user = Users.objects.get(id=actor_id)

        deleted, _ = PostUserLike.objects.filter(user=user, post=post).delete()
        if deleted:
            post.likes = max(0, post.likes - 1)
            post.save(update_fields=["likes"])

            try:
                author_profile = Profiles.objects.get(username=post.username)
                author_profile.likes = max(0, author_profile.likes - 1)
                author_profile.save(update_fields=["likes"])
            except Profiles.DoesNotExist:
                pass

        return Response({"message": "unliked", "likes": post.likes}, status=status.HTTP_200_OK)
    except Posts.DoesNotExist:
        return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)
    except Users.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(["GET", "PUT", "PATCH", "DELETE"])
def post_detail_view(request, post_id):
    try:
        post = Posts.objects.get(id=post_id)
    except Posts.DoesNotExist:
        return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        serializer = PostsSerializer(post)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method in ["PUT", "PATCH"]:
        serializer = PostsSerializer(post, data=request.data, partial=True)
        if serializer.is_valid():
            post = serializer.save()
            images = request.FILES.getlist('images')
            if images:
                PostImage.objects.filter(post=post).delete()
                for image in images:
                    PostImage.objects.create(post=post, image=image)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "DELETE":
        post.delete()
        return Response({"message": "Post deleted successfully"}, status=status.HTTP_200_OK)

