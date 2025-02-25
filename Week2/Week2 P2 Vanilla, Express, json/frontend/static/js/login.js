
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('/login')) {
        const form = document.getElementById('loginForm');
        const submitButton = document.getElementById('button-login');
        let helpLogin = document.querySelector('.helptext.login'); // 로그인 실패 메시지를 표시할 요소

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(form);
            const formObject = Object.fromEntries(formData);
            
            // 버튼 비활성화
            submitButton.disabled = true;

            // FormData 내용 로깅
            formData.forEach((value, key) => {
                console.log(`${key}: ${value}`);
            });
            console.log([...formData]);

            fetch('http://127.0.0.1:8200/api/users/login', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formObject)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('사용자 정보가 올바르지 않습니다.');
                }
                return response.json(); // 응답에서 쿠키 추출
            })
            .then(data => {
                console.log('로그인 성공!');
                helpLogin.classList.add('hide');

                // 다음 유저 인포 가져오기
                showToast('로그인 되었습니다.');
                setTimeout(() => {
                    window.location.href = '/posts';
                }, 1000);
            })
            .catch(error => {
                console.error('Error fetching:', error);
                console.error(`Login failed: ${error.message}`);
                helpLogin.classList.remove('hide');
                helpLogin.textContent = `* ${error.message || "입력하신 계정 정보가 정확하지 않습니다"}`;
                helpLogin.style.color = "red";
            })
            .finally(() => {
                // 요청이 완료되면 버튼을 다시 활성화
                // submitButton.disabled = false;
            });
        });
    }
});