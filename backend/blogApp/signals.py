from django.core.mail import send_mail
from django.dispatch import receiver
from django.db.models.signals import pre_save ,post_save , post_delete , pre_delete 
from django.contrib.auth.signals import user_logged_in
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


@receiver(user_logged_in , sender=Users)
def sendLogInMsg(instance  , sender ,**Kwargs):
    send_mail(
        "Well come Back!",
        f'{instance.email} is logged in successfully on MR-Blog.....',
        "no-reply@MR-blogTeam.com",
        [instance.email],
        fail_silently=True,
    )
       
                    
@receiver(pre_save , sender=Profiles)
def updateProfilePhoto(sender , instance , **kwargs):
    if not instance.pk:
        return
    try:
        oldProfile = Profiles.objects.get(pk = instance.pk)
    except Profiles.DoesNotExist:
        return
    
    oldImg = oldProfile.profilePic
    newImg = instance.profilePic
    
    if oldImg and oldImg != newImg:
        if os.path.isfile(oldImg.path):
            os.remove(oldImg.path)
            
            
@receiver(post_save , sender=Profiles)
def notifyUpdatingProfile(sender , instance , **kwargs):
    send_mail(
        "profile updated!",
        "your profile  on MR-blog is updated successfully...",
        "no-reply@MR-blogTeam.com",
        [instance.email],
        fail_silently=True,   
    )                    
                                
@receiver(pre_delete , sender=Users)
@receiver(pre_delete , sender=Posts)     
@receiver(pre_delete , sender = Profiles)  
def deleteFilesOnDelete(sender, instance, **kwargs):
    file_field = getattr(instance, "file", None)

    if file_field and file_field.name:
        if os.path.isfile(file_field.path):
            os.remove(file_field.path)
                    
@receiver(pre_delete , sender=Users)
@receiver(pre_delete , sender=Profiles)
@receiver(pre_delete , sender=Posts)
def creatingAudit(sender, instance ,**kwargs):
    deletionAudits.objects.create(
        model_name = sender.__name__,
        obj_id = instance.id,
        DeletedBy = get_current_user(),
        data = model_to_dict(instance)
        
    )
    
                    
                    
@receiver(pre_delete , sender=Users)
@receiver(pre_delete , sender=Profiles)
@receiver(pre_delete , sender=Posts)
def msgOfdeletion(sender, instance , ** kwargs):
    send_mail(
        f'Delete {sender.__name__}',
        "your deletion operations on MR-Blog is completed successfully",
        "no-reply@MR-blogTeam.com",
        [instance.email],
        fail_silently=True,
    )
    