from .models import Users, Posts, Profiles, PostImage
from rest_framework import serializers
from django.contrib.auth.hashers import make_password

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ['id', 'name', 'username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        if password is not None:
            validated_data['password'] = make_password(password)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        password = validated_data.get('password', None)
        if password:
            instance.password = make_password(password)
            validated_data.pop('password', None)
        return super().update(instance, validated_data)

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
