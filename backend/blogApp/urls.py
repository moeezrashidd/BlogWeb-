from django.urls import path
from . import views

urlpatterns = [
    path('users/', views.users_view, name='users'),
    path('profiles/', views.profiles_view, name='profiles'),
    path('posts/', views.posts_view, name='posts'),
    path('follow/', views.follow_user, name='follow_user'),
    path('unfollow/', views.unfollow_user, name='unfollow_user'),
    path('check_follow_status/', views.check_follow_status, name='check_follow_status'),
    path('followers/<int:user_id>/', views.get_user_followers, name='get_user_followers'),
    path('following/<int:user_id>/', views.get_user_following, name='get_user_following'),
    path('login/', views.login_view, name='login'),
    path('update_profile/<int:user_id>/', views.update_profile, name='update_profile'),
]



