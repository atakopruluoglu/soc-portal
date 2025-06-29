from rest_framework import serializers
from .models import Ticket
from .models import CustomUser

class TicketSerializer(serializers.ModelSerializer):
    created_by_email = serializers.CharField(source='created_by.email', read_only=True)
    assigned_to_email = serializers.CharField(source='assigned_to.email', read_only=True)

    class Meta:
        model = Ticket
        fields = [
            'id', 'title', 'description', 'status',
            'created_at', 'updated_at',
            'created_by', 'assigned_to',
            'created_by_email', 'assigned_to_email'
        ]
        read_only_fields = ['created_by', 'created_by_email', 'assigned_to_email', 'created_at', 'updated_at']

class UserSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'email']