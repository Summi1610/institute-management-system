pipeline {
    agent any

    stages {

        stage('Pull Latest Code') {
            steps {
                sh 'cd /opt/institute-management-system && git pull origin master'
            }
        }

        stage('Build Docker Images') {
            steps {
                sh 'cd /opt/institute-management-system && DOCKER_BUILDKIT=0 docker-compose build'
            }
        }

        stage('Stop Old Containers') {
            steps {
                sh 'cd /opt/institute-management-system && docker-compose down || true'
            }
        }

        stage('Deploy New Containers') {
            steps {
                sh 'cd /opt/institute-management-system && docker-compose up -d'
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
