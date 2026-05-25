from .models import Users, Posts, Profiles, PostImage
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ['id', 'name', 'username', 'email', 'password']


class PostImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostImage
        fields = ['id', 'image', 'created_at']

class PostsSerializer(serializers.ModelSerializer):
   
    author = UserSerializer(source='username', read_only=True)
    images = PostImageSerializer(many=True, read_only=True)

    class Meta:
        model = Posts
        fields = [
            'id',
            'author',
            'username',  
            'title',
            'content',
            'category',
            'created_at',
            'updated_at',
            'likes',
            'images',
        ]


class ProfilesSerializer(serializers.ModelSerializer):
    username = UserSerializer( read_only=True)

    class Meta:
        model = Profiles
        fields = [
            'profilePic',
            'bio',
            'disc',
            'category',
            'username',
            'followers',
            'following',
            'likes',
            'posts',
        ]

