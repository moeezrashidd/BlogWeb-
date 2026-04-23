from django.core.mail import send_mail
from django.dispatch import receiver
from django.db.models.signals import pre_save ,post_save , post_delete , pre_delete
from .models import Users , Profiles , Posts ,deletionAudits
import os
from django_currentuser.middleware import get_current_user
from django.forms.models import model_to_dict


@receiver(post_save , sender=Users)
def welcomeMail(sender,instance , created ,**kwargs):
    if created:
        send_mail(
            'Welcome to MR_blog',
            f'Thanks {instance.name} for joining our platfrom',
            'no-reply@MR-blogTeam.com',
            [instance.email],
            fail_silently=True
        )
        

@receiver(post_save , sender= Users)
def auto_Create_Profile(sender , instance , created ,**kwargs):
    if created:
        Profiles.objects.create(instance = Users)

@receiver(post_save , sender= Users)
def accountCreatMail(sender , instance , created ,**kwargs):
    if created:
        send_mail(
            "Account is created!!",
            f'Your account with gmail: {instance.email} is successfuly created on MR-blog \n Thanks for Joining....',
            "no-reply@MR-blogTeam.com",
            [instance.email],
            fail_silently=True,
            
        )
   
@receiver(post_save , sender=Users)
def addFreeBouns(sender , instance , created ,**kwargs):
    if created:
        profile = Profiles.objects.get_or_create(user = instance)
        
        profile.credits = 10
        profile.save(update_fields=["credits"])
        
        send_mail(
            "Bonus Just Landed",
            "Congratulations! Your email has been successfully confirmed, and as a reward, 10 credits have been added to your account. You can now use these credits to enjoy more features and benefits on our platform.",
            "no-reply@MR-blogTeam.com",
            [instance.email],
            fail_silently=True,
            
        )

       
                    
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
        "no-reply@MR-blogTeam.com",
        [instance.email],
        fail_silently=True,
    )
    