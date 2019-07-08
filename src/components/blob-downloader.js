// Check best place to add "js only components" - maybe "shared/" ?!

export default {
  download: function(response, filename) {
    if (!window.navigator.msSaveOrOpenBlob){
      // BLOB NAVIGATOR
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
    }else{
      // BLOB FOR EXPLORER 11
      const url = window.navigator.msSaveOrOpenBlob(new Blob([response.data]), filename);
    }
  }
}
