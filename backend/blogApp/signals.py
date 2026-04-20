from django.core.mail import send_mail
from django.dispatch import receiver
from django.db.models.signals import pre_save ,post_save , post_delete , pre_delete
from .models import Users , Profiles , Posts ,deletionAudits
import os
from django_currentuser.middleware import get_current_user
from django.forms.models import model_to_dict
@receiver(post_save , sender=Users)
def sendPreSaveMail(sender,instance , created ,**kwargs):
    if created:
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
   
                    
@receiver(pre_delete , sender=Users)
@receiver(pre_delete , sender=Posts)       
def deleteFilesOnDelete(sender, instance, **kwargs):
    file_field = getattr(instance, "file", None)

    if file_field and file_field.name:
        if os.path.isfile(file_field.path):
            os.remove(file_field.path)
                    
@receiver(pre_delete , sender=Users)
@receiver(pre_delete , sender=Posts)
def creatingAudit(sender, instance ,**kwargs):
    deletionAudits.objects.create(
        model_name = sender.__name__,
        obj_id = instance.id,
        DeletedBy = get_current_user(),
        data = model_to_dict(instance)
        
    )
    
                    
                    
@receiver(pre_delete , sender=Users)
@receiver(pre_delete , sender=Posts)
def msgOfdeletion(sender, instance , ** kwargs):
    send_mail(
        f'Delete {sender.__name__}',
        "your Account on MR-Blog is deleted successfully",
        "moeezrashidd@gmail.com",
        [instance.email],
        fail_silently=True,
    )
    