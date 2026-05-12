from .models import Users, Posts, Profiles
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ['id', 'name', 'username', 'email', 'password']


class PostsSerializer(serializers.ModelSerializer):
    # Frontend expects: post.author.username
    author = UserSerializer(source='username', read_only=True)

    class Meta:
        model = Posts
        fields = [
            'id',
            'author',
            'username',  # keep for backward compatibility if needed
            'title',
            'content',
            'created_at',
            'updated_at',
            'likes',
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
