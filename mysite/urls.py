"""mysite URL Configuration + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import include, url
from django.contrib import admin
from django.conf.urls.static import static
from django.conf import settings
from fashionAPP import views

urlpatterns = [
    # url(r'^admin/', include(admin.site.urls)),
    url(r'^$', views.index, name='index'),
    url(r'^get_db_data/$', views.get_db_data, name='get_db_data'),
    url(r'^upload_image/$', views.upload_image, name='upload_image'),
    url(r'^get_image_category/$', views.get_image_category, name='get_image_category'),
    url(r'^get_compatibility/$', views.get_compatibility, name='get_compatibility'),
    url(r'^get_topic_bubble/$', views.get_topic_bubble, name='get_topic_bubble'),
    # url(r'^get_word_cloud/$', views.get_word_cloud, name='get_word_cloud'),
    # url(r'^get_content/$', views.get_content, name='get_content'),

] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
