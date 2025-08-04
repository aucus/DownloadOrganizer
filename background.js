// 기본 설정값
const defaultRules = {
    rootFolder: "Downloads",
    categoryByExtension: {
      "pdf": "pdf",
      "docx": "docx",
      "xlsx": "xlsx",
      "jpg": "Images",
      "png": "Images",
      "pptx": "pptx",
      "zip": "zip"
    }
  };
  
  // 설정값을 저장할 전역 변수
  let cachedSettings = {};
  
  // 초기 설정 로드 및 캐싱
  function loadSettings() {
    chrome.storage.sync.get(["rootFolder", "categoryByExtension"], (settings) => {
      cachedSettings.rootFolder = settings.rootFolder || defaultRules.rootFolder;
      cachedSettings.categoryByExtension = settings.categoryByExtension || defaultRules.categoryByExtension;
    });
  }
  
  // 확장 프로그램 설치 시 초기 설정 저장
  chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set(defaultRules, () => {
      loadSettings(); // 설정값 캐싱
    });
  });
  
  // 확장 프로그램 시작 시 설정 로드
  chrome.runtime.onStartup.addListener(() => {
    loadSettings();
  });
  
  // 최초 로드 (설치되지 않은 경우 대비)
  loadSettings();
  
  // 다운로드 이벤트 감지
  chrome.downloads.onDeterminingFilename.addListener((downloadItem, suggest) => {
    // URL에서 도메인 추출
    const url = new URL(downloadItem.url);
    const domain = url.hostname.replace("www.", ""); // 예: "google.com"
  
    // 파일 확장자 추출
    const filename = downloadItem.filename;
    const extension = filename.split(".").pop().toLowerCase();
  
    // 캐싱된 설정값 사용 (비동기 호출 없음)
    const rootFolder = cachedSettings.rootFolder || defaultRules.rootFolder;
    const categories = cachedSettings.categoryByExtension || defaultRules.categoryByExtension;
  
    // 폴더 경로 생성
    let folderPath = `${rootFolder}/${domain}`;
    if (categories[extension]) {
      folderPath += `/${categories[extension]}`;
    }
  
    // 새로운 파일 경로 제안
    const newFilename = `${folderPath}/${filename}`;
    suggest({ filename: newFilename, conflictAction: "uniquify" });
  });