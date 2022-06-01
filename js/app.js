import { highlight, unHighlight, isLoading } from "./helpers/render.js";
import { uploadFiles, deleteFile, updateFile } from "./helpers/FileHelper.js";

//catch HTML Elements
const fileElement = document.querySelector('#file-element');
const dropArea = document.querySelector('#drop-area');
let deleteButtons; //will be defined after the files are dropped

//catch and handle 'dragenter', 'dragover', 'dragleave', 'drop'
const dragEvents = ['dragenter', 'dragover', 'dragleave', 'drop'];

//define an array to hold the list of file data
let filesData = [];  // [ {'id','path','name','tag', 'uploaded'} ]


/* ----------------------------- events catcher ----------------------------- */

//first remove default browser behavior from each event
dragEvents.forEach(eventName => {
	dropArea.addEventListener(eventName, preventDefaults, false);
});

//highlight the drop area when the user enters it
['dragenter', 'dragover'].forEach(eventName => {
	dropArea.addEventListener(eventName, highlight, false);
});

//un highlight the drop area when the user leaves it
['dragleave', 'drop'].forEach(eventName => {
	dropArea.addEventListener(eventName, unHighlight, false);
});

//upload the file when the user drops it
dropArea.addEventListener('drop', handleDrop, false);

//*catch the file input and upload the file
fileElement.addEventListener('change', async function (e) {
	const files = e.target.files;
	//loop through the files and get file content and push the content to filesData array
	for (let file of [...files]) {
		await getFileContent(file);
	}
	//render the files to the gallery and upload to server
	await uploadFiles(filesData);

	//register event listers for delete file buttons
	registerDeleteButtonsLeinster();
	//register event listers for update file buttons
	registerUpdateButtonsLeinster();
});



/* ----------------------------- events handlers ---------------------------- */

//*prevent default browser behavior for the events
function preventDefaults(e) {
	e.preventDefault();
	e.stopPropagation();
}

//*catch dragged files and prepare them for upload
async function handleDrop(e) {
	const files = e.dataTransfer.files;
	//loop through the files and get file content and push the content to filesData array
	for (let file of [...files]) {
		await getFileContent(file);
	}
	//render the files to the gallery and upload to server
	await uploadFiles(filesData);

	//register event listers for delete file buttons
	registerDeleteButtonsLeinster();
	//re register the event lister for delete file buttons
	registerUpdateButtonsLeinster();
}

//*get file content and push it to filesData array
function getFileContent(file) {
	let reader = new FileReader();
	reader.readAsDataURL(file);
	return new Promise(async (resolve, reject) => {
		reader.onloadend = await function () {
			//Add the file to the filesData array
			filesData.push({
				path: reader.result,
				name: file.name,
				tag: '',
			});
			resolve();
		}
	});
}

//*register event listers for delete file buttons when the files are rendered
function registerDeleteButtonsLeinster() {
	deleteButtons = document.querySelectorAll('.delete-image');
	deleteButtons.forEach(button => {
		button.addEventListener('click', function (event) {
			//delete the file from the filesData array
			const fileId = event.target.dataset.id;
			//change button loading state to loading
			isLoading(button, true, 'Delete');
			//delete the file from the server and from the gallery
			deleteFile(fileId, filesData);
			//change button loading state to Deleted
			isLoading(button, false, 'Delete');
			//re register the event lister for delete file buttons
			registerDeleteButtonsLeinster();
			//register event listers for update file buttons
			registerUpdateButtonsLeinster();
		});
	});
}

//*register event listers for update file buttons when the files are rendered
function registerUpdateButtonsLeinster() {
	const updateButtons = document.querySelectorAll('.update-image');
	updateButtons.forEach(button => {
		button.addEventListener('click', async function (event) {
			const fileId = event.target.dataset.id;
			const fileTag = event.target.parentElement.parentElement.querySelector('input[name="tag"]').value;
			//catch name input
			const fileName = event.target.parentElement.parentElement.querySelector('input[name="name"]').value;
			//update the file tag in the filesData array
			filesData = filesData.map(file => {
				if (file.id == fileId) {
					file.tag = fileTag;
					file.name = fileName;
				}
				return file;
			});

			//change button loading state to loading
			isLoading(button, true, 'Update');
			//update the file data in the server
			await updateFile(fileId, filesData);
			//change button loading state to done
			isLoading(button, false, 'Update');

			//re register the event lister for delete file buttons
			registerUpdateButtonsLeinster();
		});
	});
}


