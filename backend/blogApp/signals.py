from django.dispatch import receiver
from django.db.models.signals import pre_save ,post_save , post_delete
from .models import Users , Profiles , Posts ,deletionAudits
import os
from django_currentuser.middleware import get_current_user
from django.forms.models import model_to_dict
@receiver(post_save , sender=Users)
def sendPreSaveMail(sender,instance , created ,**kwargs):
    if created:
        from django.core.mail import send_mail
        send_mail(
            'Welcome to MR_blog',
            f'Thanks {instance.name} for joining our platfrom',
            'moeezrashidd@gmail.com',
            [instance.email],
            fail_silently=True
        )
        

@receiver(post_save , sender= Users)
def Create_Profile(sender , instance , created ,**kwargs):
    if created:
        Profiles.objects.create(instance = Users)
        
@receiver(post_delete , sender=Users)        
def deleteFilesOnDelete(sender , instance  , **kwargs):
    if instance.file:
        if os.path.isfile(instance.file.path):
            os.remove(instance.file.path)
            
@receiver(post_delete , sender=Users)
def creatingAudit(sender, instance ,**kwargs):
    deletionAudits.objects.create(
        model_name = sender.__name__,
        obj_id = instance.id,
        DeletedBy = get_current_user(),
        data = model_to_dict(instance)
        
    )
    
                    