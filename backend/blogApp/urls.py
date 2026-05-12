from django.urls import path
from . import views

urlpatterns = [
    path('users/', views.users_view, name='users'),
    path('profiles/', views.profiles_view, name='profiles'),
    path('posts/', views.posts_view, name='posts'),
    path('follow/', views.follow_user, name='follow_user'),
    path('unfollow/', views.unfollow_user, name='unfollow_user'),
    path('login/', views.login_view, name='login'),
]


