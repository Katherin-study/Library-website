document.addEventListener('DOMContentLoaded', function () {
    const genreCtx = document.getElementById('genrePieChart').getContext('2d');
    const phCtx = document.getElementById('phPieChart').getContext('2d');
    const authorElement = document.querySelector('.main_count_author p:nth-child(2)');
    let genrePieChart = null;
    let publishingHousePieChart = null;
    let responseData = null;

    function fetchData(payload) {
        fetch('/api/main', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
        .then(response => response.json())
        .then(data => {
            responseData = data;
            if (payload.genre_percentages !== undefined || payload.fetch_on_load) {
                renderGenrePercentages(data.genre_percentages);
            }
            if (payload.fetch_on_load && data.publishing_house_data) {
                renderPublishingHouseData(data.publishing_house_data);
            }
            if (payload.fetch_on_load && data.author_of_the_month) {
                renderAuthorOfTheMonth(data.author_of_the_month);
            }
            if (payload.fetch_on_load && data.age_group_percentages) {
                renderAgeGroups();
            }
            if (payload.fetch_on_load && data.sex_percentages) {
                renderSexGroups();
            }
        })
        .catch(error => console.error('Error:', error));
    }    

    fetchData({ fetch_on_load: true });

    function renderAgeGroups() {
        if (responseData && responseData.age_group_percentages && responseData.age_group_percentages.status === 'success') {
            const ageGroups = responseData.age_group_percentages.percentage;
            
            const ageContainer = document.getElementById('age_container');
            
            if (ageContainer) {
                ageContainer.innerHTML = '';

                var j=0;
            
                ageGroups.forEach(group => {
                    j++;
                    const percentage = group;
                    const count = Math.round(percentage / 10);
    
                    for (let i = 0; i < count; i++) {
                        const ageBlock = document.createElement('div');
                        ageBlock.classList.add(`age_${j}`);
                        ageContainer.appendChild(ageBlock);
                    }
                });
            } else {
                console.error('Error: Element with id "age_container" not found.');
            }
        } else {
            console.error('Error:', responseData.age_group_percentages ? responseData.age_group_percentages.message : 'Unknown error');
        }
    }
    
    function renderSexGroups() {
        if (responseData && responseData.sex_percentages && responseData.sex_percentages.status === 'success') {
            const sexGroups = responseData.sex_percentages.sex_percentages;
            
            const sexContainer = document.getElementById('sex_container');
            
            if (sexContainer) {
                sexContainer.innerHTML = '';
                
                sexGroups.forEach(group => {
                    const sex = group.sex;
                    const percentage = group.percentage;
                    const count = Math.round(percentage / 10);
        
                    for (let i = 0; i < count; i++) {
                        const sexBlock = document.createElement('div');
                        sexBlock.classList.add(sex === 'Ж' ? 'female' : 'male');
                        sexContainer.appendChild(sexBlock);
                    }
                });
            } else {
                console.error('Error: Element with id "sex_container" not found.');
            }
        } else {
            console.error('Error:', responseData.sex_percentages ? 'Unknown error' : 'Missing or incorrect data structure.');
        }
    }
    
    function renderGenrePercentages() {
        if (responseData && responseData.genre_percentages && responseData.genre_percentages.status === 'success') {
            const labels = responseData.genre_percentages.labels;
            const percentages = responseData.genre_percentages.percentages;

            const config = {
                type: 'doughnut',
                data: {
                    labels: labels,
                    datasets: [{
                        data: percentages,
                        backgroundColor: [
                            '#0C1844',
                            '#C80036',
                            '#FF6969',
                            '#5F0F40',
                            '#FB8B24',
                            '#E36414',
                            '#FFF5E1'
                        ], borderColor: [
                            '#FBFAF5'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: 'Жанровая статистика'
                        }
                    },
                    tooltips: {
                        callbacks: {
                            label: function(tooltipItem, data) {
                                const dataset = data.datasets[tooltipItem.datasetIndex];
                                const total = dataset.data.reduce((previousValue, currentValue) => previousValue + currentValue);
                                const currentValue = dataset.data[tooltipItem.index];
                                const percent = Math.round((currentValue / total) * 100);
                                return `${data.labels[tooltipItem.index]}: ${percent}%`;
                            }
                        }
                    }
                }
            };

            if (genrePieChart) {
                genrePieChart.destroy();
            }

            genrePieChart = new Chart(genreCtx, config);
        } else {
            console.error('Error:', responseData.genre_percentages ? responseData.genre_percentages.message : 'Unknown error');
        }
    }

    function renderPublishingHouseData() {
        if (responseData && responseData.publishing_house_data && responseData.publishing_house_data.status === 'success') {
            const labels = responseData.publishing_house_data.labels;
            const percentages = responseData.publishing_house_data.percentages;

            const config = {
                type: 'doughnut',
                data: {
                    labels: labels,
                    datasets: [{
                        data: percentages,
                        backgroundColor: [
                            '#0C1844',
                            '#C80036',
                            '#FF6969',
                            '#5F0F40',
                            '#FB8B24',
                            '#E36414',
                            '#FFF5E1',
                            '#424b6e',
                            '#d43963',
                            '#ff9b9b',
                            '#83446a'
                        ],
                        borderColor: [
                            '#FBFAF5'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: 'Статистика издательств'
                        },
                        tooltips: {
                            callbacks: {
                                label: function(tooltipItem, data) {
                                    const dataset = data.datasets[tooltipItem.datasetIndex];
                                    const total = dataset.data.reduce((previousValue, currentValue) => previousValue + currentValue);
                                    const currentValue = dataset.data[tooltipItem.index];
                                    const percent = Math.round((currentValue / total) * 100);
                                    return `${data.labels[tooltipItem.index]}: ${percent}%`;
                                }
                            }
                        }
                    }
                }
            };

            if (publishingHousePieChart) {
                publishingHousePieChart.destroy();
            }

            publishingHousePieChart = new Chart(phCtx, config);
        } else {
            console.error('Failed to load publishing house data:', responseData.publishing_house_data ? responseData.publishing_house_data.message : 'No data');
        }
    }

    function renderAuthorOfTheMonth(data) {
        if (authorElement) {
            const author = data[0].author || 'No data';
            authorElement.textContent = author;
        }
    }

});
