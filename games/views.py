from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import login
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth.models import User
from .forms import CustomUserCreationForm

def register(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.is_active = False  # User won't be able to login until email is verified
            user.save()

            # Generate email verification token
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            verification_url = request.build_absolute_uri(
                f'/verify-email/{uid}/{token}/'
            )

            # Send verification email
            subject = 'Verify your soul pledge to Domus Inferna'
            message = render_to_string('games/email/verify_email.html', {
                'user': user,
                'verification_url': verification_url,
            })
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [user.email],
                fail_silently=False,
            )

            return render(request, 'games/email/verification_sent.html')
    else:
        form = CustomUserCreationForm()
    return render(request, 'games/register.html', {'form': form})

def verify_email(request, uidb64, token):
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None

    if user is not None and default_token_generator.check_token(user, token):
        user.is_active = True
        user.save()
        login(request, user)
        return render(request, 'games/email/verification_success.html')
    else:
        return render(request, 'games/email/verification_failed.html')

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
