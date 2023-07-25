from django.core.mail import EmailMessage
from django.contrib.auth import get_user_model
from django.contrib.sites.shortcuts import get_current_site
from django.shortcuts import render, redirect
from django.contrib.auth import login, logout
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes, force_text
from django.contrib.auth.forms import AuthenticationForm
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from .forms import CustomUserCreationForm
from .token import account_activation_token

def login_view(request, *args, **kwargs):
    form = AuthenticationForm(request, data=request.POST or None)
    if form.is_valid():
        user_ = form.get_user()
        login(request, user_)
        return redirect("/")
    context = {"form": form, "btn_label": "Login", "title": "Login"}
    return render(request, "accounts/auth.html", context)

def logout_view(request, *args, **kwargs):
    if request.method == "POST":
        logout(request)
        return redirect("/login/")
    context = {"form": None, "description": "Are you sure you want to logout?", "btn_label": "Confirm", "title": "Logout"}
    return render(request, "accounts/auth.html", context)

def register_view(request, *args, **kwargs):
    if request.method == "POST":
        form = CustomUserCreationForm(request.POST or None)
        if form.is_valid():
            user = form.save(commit=False)
            user.is_active = False
            user.set_password(form.cleaned_data.get("password1"))
            user.save()
            current_site = get_current_site(request)
            mail_subject = "TWTR clone activation link"
            message = render_to_string("accounts/activation_email.html", {
                "user": user,
                "domain": current_site.domain,
                "uid":urlsafe_base64_encode(force_bytes(user.pk)),
                "token":account_activation_token.make_token(user),
            })
            to_email = form.cleaned_data.get("email")
            email = EmailMessage(
                        mail_subject,
                        message,
                        from_email="micwil2@st.amu.edu.pl",
                        to=[to_email]
            )
            email.send()
            context = {"message": "Check your email inbox for a confirmation email"}
            return render(request, "accounts/confirmation_page.html", context)
    else:
        form = CustomUserCreationForm()
    context = {"form": form, "btn_label": "Register", "title": "Register"}
    return render(request, "accounts/auth.html", context)

def activation_view(request, uidb64, token):
    User = get_user_model()
    try:
        uid = force_text(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except(TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None
    if user is not None and account_activation_token.check_token(user, token):
        user.is_active = True
        user.save()
        context = {"message": "Your account has been activated, you can now login"}
        return render(request, "accounts/confirmation_page.html", context)
    else:
        context = {"message": "Activation link is invalid"}
        return render(request, "accounts/confirmation_page.html", context)