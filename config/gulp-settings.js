// Получаем имя папки проекта
import * as nodePath from 'path';
const rootFolder = nodePath.basename(nodePath.resolve());

// Пути к папке с исходниками и папке с результатом
const buildFolder = `./dist`;
const srcFolder = `./src`;
const assetsFolder = `./assets`;

// Пути к папкам и файлам проекта
export const path = {
	build: {
		html: `${buildFolder}/`,
		js: `${buildFolder}/js/`,
		css: `${buildFolder}/css/`,
		images: `${buildFolder}/img/`,
		fonts: `${buildFolder}/fonts/`,
		files: `${buildFolder}/files/`
	},
	src: {
		html: `${srcFolder}/*.html`,
		pug: `${srcFolder}/pug/*.pug`,
		js: `${srcFolder}/js/main.js`,
		scss: `${srcFolder}/sass/style.sass`,
		images: `${assetsFolder}/img/**/*.{jpg,jpeg,png,gif,webp,avif}`,
		svg: `${assetsFolder}/img/**/*.svg`,
		fonts: `${assetsFolder}/fonts/*.*`,
		files: `${assetsFolder}/files/**/*.*`,
		svgicons: `${assetsFolder}/svg/*.svg`,
	},
	clean: buildFolder,
	buildFolder: buildFolder,
	rootFolder: rootFolder,
	srcFolder: srcFolder,
	assetsFolder: assetsFolder,
	ftp: `` // Путь к нужной папке на удаленном сервере. gulp добавит имя папки проекта автоматически
};

// Настройка FTP соединения
export const configFTP = {
	host: "", // Адрес FTP сервера
	user: "", // Имя пользователя
	password: "", // Пароль
	parallel: 5 // Кол-во одновременных потоков
}