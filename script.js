document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const resultsContainer = document.getElementById('results');
    const resultsCountElement = document.getElementById('results-count');
    let questionsData = [];

    // مرحله ۱: دریافت داده‌ها از فایل JSON
    fetch('data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            questionsData = data;
            displayResults(questionsData); // نمایش تمام سوالات در ابتدا
            searchInput.addEventListener('input', handleSearch); // اضافه کردن Listener جستجو
        })
        .catch(error => {
            console.error('Error loading data:', error);
            resultsContainer.innerHTML = '<p style="color: red;">خطا در بارگذاری داده‌ها. مطمئن شوید فایل data.json در دسترس است.</p>';
        });

    // تابع اصلی جستجو
    function handleSearch() {
        const searchTerm = searchInput.value.trim();
        
        if (searchTerm.length === 0) {
            displayResults(questionsData); // نمایش همه اگر کادر خالی باشد
            return;
        }

        const lowerCaseSearchTerm = searchTerm.toLowerCase();

        // فیلتر کردن سوالات
        const filteredQuestions = questionsData.filter(item => {
            const questionText = item.question.toLowerCase();
            const answerText = item.correct_answer_text.toLowerCase();

            // جستجو در متن سوال
            if (questionText.includes(lowerCaseSearchTerm)) {
                return true;
            }

            // جستجو در متن پاسخ صحیح
            if (answerText.includes(lowerCaseSearchTerm)) {
                return true;
            }
            
            // اگر کاربر 'الف' 'ب' 'ج' یا 'د' را جستجو کند، آنهایی که آن گزینه جواب است بیایند.
            if (['الف', 'ب', 'ج', 'د'].includes(lowerCaseSearchTerm) && item.correct_option_key === lowerCaseSearchTerm) {
                return true;
            }

            return false;
        });

        displayResults(filteredQuestions);
    }

    // تابع نمایش نتایج
    function displayResults(results) {
        resultsContainer.innerHTML = ''; // پاک کردن نتایج قبلی
        resultsCountElement.textContent = `تعداد نتایج یافت شده: ${results.length}`;
        
        if (results.length === 0) {
            resultsContainer.innerHTML = '<p>نتیجه‌ای یافت نشد.</p>';
            return;
        }

        results.forEach(item => {
            const card = document.createElement('div');
            card.className = 'question-card';
            
            const questionTitle = document.createElement('h2');
            questionTitle.textContent = `${item.number}. ${item.question}`;
            
            const optionsDiv = document.createElement('div');
            optionsDiv.className = 'options';

            // نمایش گزینه‌ها
            for (const key in item.options) {
                if (item.options.hasOwnProperty(key)) {
                    const optionP = document.createElement('p');
                    optionP.textContent = `${key}) ${item.options[key]}`;
                    
                    // مشخص کردن پاسخ صحیح با استایل
                    if (key === item.correct_option_key) {
                        optionP.classList.add('correct');
                    }
                    optionsDiv.appendChild(optionP);
                }
            }

            // نمایش پاسخ صحیح در کادر جداگانه
            const answerDiv = document.createElement('div');
            answerDiv.className = 'answer';
            answerDiv.textContent = `پاسخ صحیح: ${item.correct_option_key} (${item.correct_answer_text})`;

            card.appendChild(questionTitle);
            card.appendChild(optionsDiv);
            card.appendChild(answerDiv);
            resultsContainer.appendChild(card);
        });
    }

});