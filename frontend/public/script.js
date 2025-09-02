// DOM elements
const urlForm = document.getElementById('urlForm');
const originalUrlInput = document.getElementById('originalUrl');
const shortenBtn = document.getElementById('shortenBtn');
const resultDiv = document.getElementById('result');
const loadingDiv = document.getElementById('loading');
const errorDiv = document.getElementById('error');
const originalUrlDisplay = document.getElementById('originalUrlDisplay');
const shortUrlDisplay = document.getElementById('shortUrlDisplay');
const copyBtn = document.getElementById('copyBtn');
const qrCodeImg = document.getElementById('qrCode');
const errorMessage = document.getElementById('errorMessage');

// Show/hide elements
function showElement(element) {
  element.classList.remove('hidden');
}

function hideElement(element) {
  element.classList.add('hidden');
}

function hideAllStates() {
  hideElement(resultDiv);
  hideElement(loadingDiv);
  hideElement(errorDiv);
}

// URL validation
function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Show loading state
function showLoading() {
  hideAllStates();
  showElement(loadingDiv);
  shortenBtn.disabled = true;
  shortenBtn.textContent = '단축 중...';
}

// Show result
function showResult(data) {
  hideAllStates();
  showElement(resultDiv);

  originalUrlDisplay.textContent = data.originalUrl;
  shortUrlDisplay.value = data.shortUrl;
  qrCodeImg.src = data.qrCode;

  shortenBtn.disabled = false;
  shortenBtn.textContent = '단축하기';
}

// Show error
function showError(message) {
  hideAllStates();
  showElement(errorDiv);
  errorMessage.textContent = message;

  shortenBtn.disabled = false;
  shortenBtn.textContent = '단축하기';
}

// Copy to clipboard
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textArea);
    return success;
  }
}

// Handle form submission
async function handleSubmit(e) {
  e.preventDefault();

  const originalUrl = originalUrlInput.value.trim();

  if (!originalUrl) {
    showError('URL을 입력해주세요.');
    return;
  }

  if (!isValidUrl(originalUrl)) {
    showError('유효한 URL 형식이 아닙니다.');
    return;
  }

  showLoading();

  try {
    const response = await fetch('/api/shorten', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ originalUrl }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'URL 단축에 실패했습니다.');
    }

    showResult(data);

  } catch (error) {
    console.error('Error:', error);
    showError(error.message || '네트워크 오류가 발생했습니다.');
  }
}

// Handle copy button click
async function handleCopy() {
  const url = shortUrlDisplay.value;

  const success = await copyToClipboard(url);

  if (success) {
    copyBtn.textContent = '복사됨!';
    copyBtn.classList.add('copied');

    setTimeout(() => {
      copyBtn.textContent = '복사';
      copyBtn.classList.remove('copied');
    }, 2000);
  } else {
    alert('복사에 실패했습니다. 수동으로 복사해주세요.');
  }
}

// Event listeners
urlForm.addEventListener('submit', handleSubmit);
copyBtn.addEventListener('click', handleCopy);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  // Focus on input when page loads
  originalUrlInput.focus();

  // Hide all states initially
  hideAllStates();
});
