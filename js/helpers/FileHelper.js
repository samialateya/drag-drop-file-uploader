import { renderFile, clearGallery } from './render.js';
import { APIHelper } from './APIHelper.js';
/* ------------------------------- file upload ------------------------------ */
//*render the files to the gallery and upload to server
export async function uploadFiles(filesData) {
	//clear rendering area
	clearGallery();

	//*loop through the files and preview them
	filesData.forEach((file, key) => {
		//save file id to files array
		filesData[key].id = key + 1; //?to not start with 0
		//*render the file to the gallery
		renderFile(file);
	});

	//*upload file to database
	filesData.forEach(async (file) => {
		//?upload file to server if the uploaded status is false
		if (!file.uploaded) {
			const response = await saveImageToServer(file);
			//update the uploaded status to true
			file.uploaded = true;
			//set server id to file
			// file.id = response.data.id;
		}
	});
}

/* ----------------------- upload the image to server ----------------------- */
async function saveImageToServer(file) {
	return new Promise(async (resolve, reject) => {
		//prepare the data to send to the server
		const formData = new FormData();
		// const imageBlob = new Blob([file.path] , {type: 'image/jpg'});
		const imageBlob = await base64ToBlob(file.path);
		const fileSRC = new File([imageBlob] , file.name, {type: 'image/jpg'});
		formData.append('image', fileSRC);
		formData.append('name', file.name);
		formData.append('tag', file.tag);

		//send the data to the server
		const response = await (new APIHelper()).post('/user/profile/update/change-avatar', formData, { 'Authorization': `Bearer 1|hV9Hk6P1azENWQc1psJ1I7z6dLBS6Bprbovwi2yV` });
		
		resolve(response);
	});
}

//*convert base64 to blob
function base64ToBlob(base64) {
	return new Promise(async (resolve) => {
		const file = await fetch(base64);
		const blob = await file.blob();
		resolve(blob);
	});
}


/* ------------------------------- delete file ------------------------------ */
export function deleteFile(fileID, filesData) {
	return new Promise(async (resolve, reject) => {

		const response = await (new APIHelper()).post('/user/profile/'+fileID, {}, { 'Authorization': `Bearer 1|hV9Hk6P1azENWQc1psJ1I7z6dLBS6Bprbovwi2yV` });
		//clear rendering area
		clearGallery();
		//*loop through the files and preview them
		filesData.forEach((file) => { renderFile(file); });
		resolve(response);
	});
}


/* ------------------------------- update file ------------------------------ */
export function updateFile(fileID, filesData) {
	//catch current file data
	const file = filesData.find((file) => file.id == fileID);
	return new Promise(async (resolve, reject) => {
		//prepare the data to send to the server
		const formData = new FormData();
		formData.append('tag', file.tag);
		formData.append('name', file.name);
		formData.append('id', file.id);

		const response = await (new APIHelper()).post('/user/profile/update', formData, { 'Authorization': `Bearer 1|hV9Hk6P1azENWQc1psJ1I7z6dLBS6Bprbovwi2yV` });
		resolve(response);
	});
}