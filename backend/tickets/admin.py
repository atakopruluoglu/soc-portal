from django.contrib import admin
from .models import Ticket

class TicketAdmin(admin.ModelAdmin):
    list_display = ('title', 'status', 'assigned_to', 'created_by', 'created_at')
    list_filter = ('status', 'assigned_to')
    search_fields = ('title', 'description')

admin.site.register(Ticket, TicketAdmin)
