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
	var description = document.getElementById('description');
	var profilPresentation = document.getElementById('profilPresentation');

	var rawProfil = /\Wprofil\W.+/i.exec(window.location.href)[0];
	var profilConsulted = rawProfil.substr(8, rawProfil.length)
	iconEditDescription.style.display = 'none';
	iconEditAvatar.style.display = 'none';

	profilPresentation.addEventListener('mouseover', function (event) {
		if (profilConsulted === profil) {
			iconEditDescription.style.display = 'initial';
		}
	});

	profilPresentation.addEventListener('mouseleave', function (event) {
		if (profilConsulted === profil) {
			iconEditDescription.style.display = 'none';
		}
	});


	iconEditDescription.addEventListener('click', function (event) {
		iconEditDescription.style.display = 'none';
		description.style.display = 'none';
		descriptionForm.style.display = 'initial';
		cancelEditDescription.style.display = 'initial';
		editDescription.innerHTML = description.innerHTML;
		editDescription.value = description.innerHTML
	});

	cancelEditDescription.addEventListener('click', function (event) {
		event.preventDefault();
		description.style.display = 'inherit';
		iconEditDescription.style.display = 'initial';
		descriptionForm.style.display = 'none';
		cancelEditDescription.style.display = 'none';
	});
});