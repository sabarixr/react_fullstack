from django.shortcuts import render
from rest_framework.views import APIView
from . models import *
from . serializer import *
from rest_framework.response import Response


class NotesView(APIView):
    def get(self, request):
        output = [{"text": note.text, "deadline": note.deadline} for note in Note.objects.all()]
        return Response(output)
    
    def post(self, request):
        serializer = NoteSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)
