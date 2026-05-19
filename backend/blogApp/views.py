from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Users, Profiles, Posts
from .serializer import UserSerializer, PostsSerializer, ProfilesSerializer


@api_view(["GET", "POST"])
def users_view(request):
    if request.method == "GET":
        data = Users.objects.all()
        serializer = UserSerializer(data, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == "POST":
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "POST"])
def posts_view(request):
    if request.method == "GET":
        data = Posts.objects.all()  
        serializer = PostsSerializer(data, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == "POST":
        serializer = PostsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(["GET", "POST"])
def profiles_view(request):
    if request.method == "GET":
        data = Profiles.objects.all()  
        serializer = ProfilesSerializer(data, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == "POST":
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
        return Response({"error": "actor_id and target_id are required"}, status=status.HTTP_400_BAD_REQUEST)
        
    if actor_id == target_id:
        return Response({"error": "You cannot follow yourself"}, status=status.HTTP_400_BAD_REQUEST)
        
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
        return Response({"error": "actor_id and target_id are required"}, status=status.HTTP_400_BAD_REQUEST)
        
    try:
        actor = Users.objects.get(id=actor_id)
        target = Users.objects.get(id=target_id)
    except Users.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        
    target.followers.remove(actor)
    return Response({"message": "Successfully unfollowed"}, status=status.HTTP_200_OK)

@api_view(["POST"])
def login_view(request):
    email = request.data.get("email")
    password = request.data.get("password")
    
    if not email or not password:
        return Response({"error": "Email and password are required"}, status=status.HTTP_400_BAD_REQUEST)
        
    try:
        user = Users.objects.get(email=email)
        if user.password == password:
            serializer = UserSerializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid password"}, status=status.HTTP_400_BAD_REQUEST)
    except Users.DoesNotExist:
        return Response({"error": "User with this email does not exist"}, status=status.HTTP_404_NOT_FOUND)

@api_view(["GET"])
def check_follow_status(request):
    actor_id = request.query_params.get("actor_id")
    target_id = request.query_params.get("target_id")
    
    if not actor_id or not target_id:
        return Response({"error": "actor_id and target_id are required"}, status=status.HTTP_400_BAD_REQUEST)
        
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

    # Update user name if provided
    name = request.data.get('name')
    if name:
        user.name = name
        user.save()

    # The request might be multipart/form-data. The serializer handles it.
    serializer = ProfilesSerializer(profile, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
