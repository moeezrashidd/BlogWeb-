from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Users, Profiles, Posts
from .serializer import UserSerializer, PostsSerializer, ProfilesSerializer


# ---------------- USERS ----------------
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


# ---------------- POSTS ----------------
@api_view(["GET", "POST"])
def posts_view(request):
    if request.method == "GET":
        data = Posts.objects.all()  # ✅ fixed
        serializer = PostsSerializer(data, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == "POST":
        serializer = PostsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ---------------- PROFILES ----------------
@api_view(["GET", "POST"])
def profiles_view(request):
    if request.method == "GET":
        data = Profiles.objects.all()  # ✅ fixed
        serializer = ProfilesSerializer(data, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == "POST":
        serializer = ProfilesSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
