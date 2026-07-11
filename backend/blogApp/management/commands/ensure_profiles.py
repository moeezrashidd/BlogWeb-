from django.core.management.base import BaseCommand
from django.db import transaction

from blogApp.models import Users, Profiles

class Command(BaseCommand):
    help = "Backfill missing Profiles for existing Users (one-to-one)."

    def add_arguments(self, parser):
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Do not write anything to the database; only report what would be created.",
        )

    def handle(self, *args, **options):
        dry_run = bool(options.get("dry_run"))

        created_count = 0
        already_count = 0
        missing_count = 0

        users_qs = Users.objects.all().only("id", "username", "email", "name")

        with transaction.atomic():
            for user in users_qs.iterator():
                try:
                    _ = user.profiles
                    already_count += 1
                    continue
                except Profiles.DoesNotExist:
                    missing_count += 1

                if not dry_run:
                    Profiles.objects.create(
                        username=user,
                        category="Technology",
                        disc="",
                        credits=10,
                    )
                    created_count += 1

        if dry_run:
            self.stdout.write(
                self.style.WARNING(
                    f"[DRY RUN] missing_profiles={missing_count}, would_create={created_count}, already_have={already_count}"
                )
            )
        else:
            self.stdout.write(
                self.style.SUCCESS(
                    f"created_profiles={created_count}, already_have={already_count}, missing_profiles_were_created={missing_count}"
                )
            )
