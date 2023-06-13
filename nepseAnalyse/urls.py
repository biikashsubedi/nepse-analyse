from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from decouple import config
from django.views.generic.base import RedirectView

# naming the system
admin.site.site_header = config('ADMIN_APP_SITE_HEADER')
admin.site.index_title = config('APP_NAME')
admin.site.site_title = config('ADMIN_APP_SITE_TITLE')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('apps.system.user.urls')),

    path('', RedirectView.as_view(url='home', permanent=False), name='home'),
    path('home/', include('apps.system.home.urls')),
    path('config/', include('apps.system.config.urls')),
    path('nepse/', include('apps.system.data.urls')),
    path('fundamental/', include('apps.system.fundamental.urls')),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
