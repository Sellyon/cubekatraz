'use strict';
window.document.addEventListener('DOMContentLoaded', function () {
	document.body.background = "/images/backgrounds/photoBG.png";
	document.body.style.backgroundSize = "cover";
	document.body.style.backgroundAttachment = "fixed";
	var description = document.getElementById('description');
	var editDescription = document.getElementById('editDescription');
	var iconEditDescription = document.getElementById('iconEditDescription');
	var iconEditAvatar = document.getElementById('iconEditAvatar');
	var descriptionForm = document.getElementById('descriptionForm');
	var cancelEditDescription = document.getElementById('cancelEditDescription');
	var profilPresentation = document.getElementById('profilPresentation');
	var profilAvatar = document.getElementById('profilAvatar');
	var editAvatar = document.getElementById('editAvatar');
	var avatarPreview = document.getElementById('avatarPreview');
	var iconAddFriend = document.getElementById('iconAddFriend');
	var inputDelayer;

	iconEditDescription.style.display = 'none';
	iconEditAvatar.style.display = 'none';
	
	if (hideIcon === 'true') {
		iconAddFriend.style.display = 'none';
	}

	// Icon edit description
	profilPresentation.addEventListener('mouseover', function (event) {
		if (consultedProfile === profil && descriptionForm.style.display !== 'initial') {
			iconEditDescription.style.display = 'initial';
		}
	});

	profilPresentation.addEventListener('mouseleave', function (event) {
		if (consultedProfile === profil) {
			iconEditDescription.style.display = 'none';
		}
	});

	// Modify description request method post
	iconEditDescription.addEventListener('click', function (event) {
		iconEditDescription.style.display = 'none';
		description.style.display = 'none';
		descriptionForm.style.display = 'initial';
		cancelEditDescription.style.display = 'initial';
		editDescription.innerHTML = description.innerHTML;
		editDescription.value = description.innerHTML;
	});

	cancelEditDescription.addEventListener('click', function (event) {
		event.preventDefault();
		description.style.display = 'inherit';
		iconEditDescription.style.display = 'initial';
		descriptionForm.style.display = 'none';
		cancelEditDescription.style.display = 'none';
	});

	// Icon edit avatar
	profilAvatar.addEventListener('mouseover', function (event) {
		if (consultedProfile === profil && avatarForm.style.display !== 'initial' && descriptionForm.style.display !== 'initial') {
			iconEditAvatar.style.display = 'initial';
		}
	});

	profilAvatar.addEventListener('mouseleave', function (event) {
		if (consultedProfile === profil) {
			iconEditAvatar.style.display = 'none';
		}
	});

	// Modify avatar request method post
	iconEditAvatar.addEventListener('click', function (event) {
		iconEditAvatar.style.display = 'none';
		avatarForm.style.display = 'initial';
		cancelEditAvatar.style.display = 'initial';
		editAvatar.innerHTML = avatarProfil;
		editAvatar.value = avatarProfil;
		avatarPreview.src=editAvatar.value;
	});

	cancelEditAvatar.addEventListener('click', function (event) {
		event.preventDefault();
		iconEditAvatar.style.display = 'initial';
		avatarForm.style.display = 'none';
		cancelEditAvatar.style.display = 'none';
	});

	editAvatar.addEventListener('input', function (event) {
		clearTimeout(inputDelayer);
		inputDelayer = setTimeout(function(){
			avatarPreview.src=editAvatar.value;
		}, 1000);
	});
});