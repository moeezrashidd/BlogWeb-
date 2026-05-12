from .models import Users , Posts , Profiles
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields=['id', 'name', 'username', 'email','password']


class PostsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Posts
        fields=['id' , 'username' , 'title', 'content', 'created_at','updated_at']

class ProfilesSerializer(serializers.ModelSerializer):
    class Meta:
        model=Profiles
        fields=['profilePic', 'bio', 'disc','category','username' , 'followers' , 'following' , 'likes', 'posts']
        depth = 1