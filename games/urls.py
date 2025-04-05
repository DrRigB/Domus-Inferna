from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('games/', views.games, name='games'),
    path('leaderboard/', views.leaderboard, name='leaderboard'),
    path('profile/', views.profile, name='profile'),
    path('roulette/', views.roulette, name='roulette'),
    path('blackjack/', views.blackjack, name='blackjack'),
    path('slots/', views.slots, name='slots'),
] 