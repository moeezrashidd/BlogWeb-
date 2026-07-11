import os
import django
from unittest.mock import patch

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'BACKEND.settings')
django.setup()

from blogApp.models import Users, Profiles, Posts

with patch('blogApp.signals.send_mail') as mock_send_mail:
    users_data = [
        {'name': 'Alice Smith', 'username': 'alicesmith', 'email': 'alice@example.com', 'password': 'password123', 'bio': 'I love writing about AI and future tech.', 'cat': 'Technology'},
        {'name': 'Bob Johnson', 'username': 'bobjohnson', 'email': 'bob@example.com', 'password': 'password123', 'bio': 'Travel enthusiast sharing my journeys.', 'cat': 'Travel'},
        {'name': 'Charlie Davis', 'username': 'charliedavis', 'email': 'charlie@example.com', 'password': 'password123', 'bio': 'Food blogger and recipe creator.', 'cat': 'Food & Recipes'},
    ]

    for ud in users_data:
        user, created = Users.objects.get_or_create(
            username=ud['username'],
            defaults={'name': ud['name'], 'email': ud['email'], 'password': ud['password']}
        )
        if created:
            print(f"Created user {user.username}")

        profile = Profiles.objects.get(username=user)
        profile.bio = ud['bio']
        profile.disc = 'Regular Contributor'
        profile.category = ud['cat']
        profile.save()

        Posts.objects.get_or_create(
            username=user,
            title=f"First post by {user.name}",
            defaults={'content': f"This is the very first post written by {user.name}. It explores the topics of {ud['cat']}. Stay tuned for more!"}
        )
        Posts.objects.get_or_create(
            username=user,
            title=f"Deep dive into {ud['cat']}",
            defaults={'content': f"In this article, I want to talk about {ud['cat']}. Here are some thoughts on the matter..."}
        )

    print("Database seeded successfully!")
