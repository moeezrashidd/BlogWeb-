from .models import Users , Posts , Profiles
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields=['id', 'name', 'username', 'email','password']


class PostsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Posts
        fields=['id' , 'author' , 'title', 'content', 'created_at','updated_at']

class ProfilesSerializer(serializers.ModelSerializer):
    class Meta:
        model=Profiles
        fields=['protilePic', 'bio', 'disc','category','username' , 'followers' , 'following' , 'likes', 'posts']        