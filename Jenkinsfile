pipeline {
    agent any

    stages {

        stage('Pull Latest Code') {
            steps {
                dir('/opt/institute-management-system') {
                    sh 'git pull origin main'
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                dir('/opt/institute-management-system') {
                    sh 'DOCKER_BUILDKIT=0 docker-compose build'
                }
            }
        }

        stage('Stop Old Containers') {
            steps {
                dir('/opt/institute-management-system') {
                    sh 'docker-compose down || true'
                }
            }
        }

        stage('Deploy New Containers') {
            steps {
                dir('/opt/institute-management-system') {
                    sh 'docker-compose up -d'
                }
            }
        }
    }

    post {
        success {
            echo '✅ Deployment Successful!'
        }
        failure {
            echo '❌ Deployment Failed!'
        }
    }
}
