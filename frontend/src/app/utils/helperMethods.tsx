export const getFileNameWithoutExtension = (fileName: string) => {
    return fileName.split('.')[0];
};

export const getFileExtensionType = (fileName: string) => {
    return fileName.split('.')[1];
};
