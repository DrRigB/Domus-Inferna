from django.shortcuts import render
from django.contrib.auth.decorators import login_required

# Create your views here.

def home(request):
    # Mock data for the leaderboard
    top_players = [
        {'name': 'Soul Hunter', 'souls': 666},
        {'name': 'Devil\'s Advocate', 'souls': 500},
        {'name': 'Phantom Gambler', 'souls': 333},
        {'name': 'Soul Collector', 'souls': 250},
        {'name': 'Void Walker', 'souls': 100},
    ]
    return render(request, 'games/home.html', {'top_players': top_players})

def games(request):
    return render(request, 'games/games.html')

def leaderboard(request):
    # For now, we'll use dummy data
    # In a real application, this would come from your database
    players = [
        {
            'username': 'SoulMaster',
            'level': 42,
            'souls': 1000000,
            'games_played': 150,
            'avatar_url': '/static/games/images/avatars/soulmaster.png'
        },
        {
            'username': 'DevilHunter',
            'level': 38,
            'souls': 850000,
            'games_played': 120,
            'avatar_url': '/static/games/images/avatars/devilhunter.png'
        },
        {
            'username': 'LuckDemon',
            'level': 35,
            'souls': 750000,
            'games_played': 100,
            'avatar_url': '/static/games/images/avatars/luckdemon.png'
        },
        {
            'username': 'SoulGambler',
            'level': 30,
            'souls': 500000,
            'games_played': 80,
            'avatar_url': '/static/games/images/avatars/soulgambler.png'
        },
        {
            'username': 'FortuneSeeker',
            'level': 25,
            'souls': 300000,
            'games_played': 60,
            'avatar_url': '/static/games/images/avatars/fortuneseeker.png'
        }
    ]
    return render(request, 'games/leaderboard.html', {'players': players})

@login_required
def profile(request):
    return render(request, 'games/profile.html')

@login_required
def roulette(request):
    return render(request, 'games/roulette.html')

@login_required
def blackjack(request):
    return render(request, 'games/blackjack.html')

@login_required
def slots(request):
    return render(request, 'games/slots.html')
