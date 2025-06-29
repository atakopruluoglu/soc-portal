from rest_framework import viewsets, permissions
from .models import Ticket
from .serializers import TicketSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    def update(self, request, *args, **kwargs):
        ticket = self.get_object()
        if request.user != ticket.created_by and request.user != ticket.assigned_to:
            return Response({'detail': 'Bu ticketı güncelleme izniniz yok.'}, status=status.HTTP_403_FORBIDDEN)
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        ticket = self.get_object()
        if request.user != ticket.created_by:
            return Response({'detail': 'Bu ticketı silme izniniz yok.'}, status=status.HTTP_403_FORBIDDEN)
        return super().destroy(request, *args, **kwargs)
