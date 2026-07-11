from django.urls import path
from . import views

urlpatterns = [
    path('users/', views.users_view, name='users'),
    path('profiles/', views.profiles_view, name='profiles'),
    path('posts/', views.posts_view, name='posts'),
    path('posts/<int:post_id>/', views.post_detail_view, name='post_detail'),
    path('follow/', views.follow_user, name='follow_user'),
    path('unfollow/', views.unfollow_user, name='unfollow_user'),
    path('check_follow_status/', views.check_follow_status, name='check_follow_status'),
    path('followers/<int:user_id>/', views.get_user_followers, name='get_user_followers'),
    path('following/<int:user_id>/', views.get_user_following, name='get_user_following'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('update_profile/<int:user_id>/', views.update_profile, name='update_profile'),

    path('check_post_like/', views.check_post_like, name='check_post_like'),
    path('like_post/', views.like_post, name='like_post'),
    path('unlike_post/', views.unlike_post, name='unlike_post'),
]

