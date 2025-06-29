# users/views.py
from rest_framework import viewsets
from .models import CustomUser
from .serializers import UserSerializer
from rest_framework.permissions import IsAuthenticated

class UserViewSet(viewsets.ReadOnlyModelViewSet):  # sadece listeleme yeterli
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
