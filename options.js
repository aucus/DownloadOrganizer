document.addEventListener("DOMContentLoaded", () => {
    // 저장된 설정 불러오기
    chrome.storage.sync.get(["rootFolder", "categoryByExtension"], (settings) => {
      document.getElementById("rootFolder").value = settings.rootFolder || "Downloads";
  
      const categories = settings.categoryByExtension || {};
      const container = document.getElementById("categories");
      for (let ext in categories) {
        container.innerHTML += `<label>${ext}: <input type="text" data-ext="${ext}" value="${categories[ext]}"></label><br>`;
      }
    });
  
    // 설정 저장
    document.getElementById("save").addEventListener("click", () => {
      const rootFolder = document.getElementById("rootFolder").value;
      const inputs = document.querySelectorAll("#categories input");
      const categoryByExtension = {};
      inputs.forEach(input => {
        categoryByExtension[input.dataset.ext] = input.value;
      });
  
      chrome.storage.sync.set({ rootFolder, categoryByExtension }, () => {
        alert("Settings saved!");
      });
    });
  });