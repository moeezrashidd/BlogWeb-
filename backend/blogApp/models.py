from django.db import  models
from PIL import Image, ImageDraw
class Users(models.Model):
    id = models.AutoField(primary_key = True)
    name = models.CharField(max_length= 30)
    username= models.CharField(unique= True, max_length=50)
    email=models.EmailField(max_length=254)
    password = models.CharField( max_length=8)

class Profiles(models.Model):  
    categoryOpts =[
    ("Technology" , "Technology"),
    ("Business & Finance" ,"Business & Finance"),
    ("Education & Learning" , "Education & Learning"),
    ("Health & Wellness" ,"Health & Wellness"),
    ("Lifestyle" , "Lifestyle"),
    ("Food & Recipes","Food & Recipes"),
    ("Travel","Travel"),
    ("Entertainment" ,"Entertainment"),
    ("Fashion & Beauty" ,"Fashion & Beauty"),
    ("Creative Arts" ,"Creative Arts"),
    ("Science & Knowledge" , "Science & Knowledge"),
    ("Sports & Fitness" ,"Sports & Fitness"),
    ("Environment & Social","Environment & Social")]
    profilePic = models.ImageField(upload_to="profilePpics/",blank = True , null = True)
    bio = models.CharField(max_length = 150, blank=True)
    disc = models.CharField(max_length=500)
    category = models.CharField(choices = categoryOpts,max_length=50)
    username = models.OneToOneField(Users, on_delete=models.CASCADE)    
    followers = models.PositiveIntegerField(default= 0)
    following = models.PositiveIntegerField(default= 0)
    likes = models.PositiveIntegerField(default= 0)
    posts = models.PositiveIntegerField(default= 0)
    
    def uploadPhoto(self,*args , **kwargs):
        super.save(*args , **kwargs)
        
        image = Image.open(self.image.path).convert("RGBA")
        
        size = min(image.size)
        
        left = (image.width - size) //2
        top = (image.height-size )//2
        right = left + size
        bottom = top +size
        
        image.crop((left,top,right,bottom))
        
        image.save(self.image.path.replace(".jpg "," .png") , format="PNG")
        
        

class Posts(models.Model):
    id= models.AutoField(primary_key=True)   
    author = models.ForeignKey(Users, to_field='username', on_delete=models.CASCADE, related_name='posts')
    title= models.CharField(max_length= 150)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
   
     