pipeline {
    agent any

    tools {
        nodejs 'node18'
    }

    environment {
        SONAR_SCANNER_HOME = tool 'SonarQube Scanner'
        APP_URL = 'http://127.0.0.1:4172'

    }

    stages {

        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                  node -v
                  npm -v
                  npm install
                '''
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('sonarqube') {
                    sh """
                    ${SONAR_SCANNER_HOME}/bin/sonar-scanner \
                      -Dsonar.projectKey=todo-ui-devsecops \
                      -Dsonar.projectName=Todo-UI-DevSecOps \
                      -Dsonar.sources=src \
                      -Dsonar.language=js
                    """
                }
            }
        }

        stage('Quality Gate') {
            steps {
                timeout(time: 2, unit: 'MINUTES') {
                waitForQualityGate abortPipeline: false
                }
            }
        }
        
        stage('Build App') {
            steps {
                sh 'npm run build'
            }
        }
        stage('Start App for DAST') {
            steps {
                sh '''
                echo "Starting temporary app for DAST..."

                npm run preview -- --host 127.0.0.1 --port 4172 > app.log 2>&1 &

                for i in {1..10}; do
                    if curl -s http://127.0.0.1:4172 >/dev/null; then
                        echo "Temporary app is running on 4172"
                    break
                    fi
                    echo "Waiting for temporary app..."
                    sleep 5
                done
                '''
            }
        }


        stage('OWASP ZAP DAST (Docker)') {
            steps {
                sh '''
                docker run --rm --network=host \
                -u 0 \
                -v "$(pwd)":/zap/wrk \
                ghcr.io/zaproxy/zaproxy:stable \
                zap-baseline.py \
                -t ${APP_URL} \
                -r zap-report.html \
                -w zap-warn.txt \
                -x zap-report.xml \
                -I
                '''
            }
        }

        stage('ZAP Quality Gate') {
            steps {
                sh '''
                echo "Evaluating ZAP Quality Gate..."
        
                HIGH=$(grep -c "<riskcode>3</riskcode>" zap-report.xml || true)
                MEDIUM=$(grep -c "<riskcode>2</riskcode>" zap-report.xml || true)
                LOW=$(grep -c "<riskcode>1</riskcode>" zap-report.xml || true)
        
                echo "ZAP Findings:"
                echo "High: $HIGH"
                echo "Medium: $MEDIUM"
                echo "Low: $LOW"
        
                if [ "$HIGH" -gt 0 ]; then
                  echo "❌ ZAP Quality Gate failed: High risk findings detected"
                  exit 1
                fi
        
                if [ "$MEDIUM" -gt 5 ]; then
                  echo "❌ ZAP Quality Gate failed: Medium risk findings detected"
                  exit 1
                fi
        
                if [ "$LOW" -gt 5 ]; then
                  echo "❌ ZAP Quality Gate failed: Too many Low risk findings"
                  exit 1
                fi
        
                echo "✅ ZAP Quality Gate passed"
                '''
            }
        }


        stage('Deploy UI') {
            steps {
                sh '''
                echo "Starting UI Deployment..."

                DEPLOY_DIR="/home/zionit/zioteams/todo-ui"

                if [ ! -d "$DEPLOY_DIR" ]; then
                  echo "ERROR: Deployment directory does not exist!"
                exit 1
                fi

                rm -rf ${DEPLOY_DIR:?}/*
                cp -r dist/* $DEPLOY_DIR/

                echo "Deployment completed"
                ls -la $DEPLOY_DIR
                '''
            }
        }

        stage('Fetch SonarQube Report') {
            steps {
                withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')]) {
                    sh '''
                    echo "Fetching SonarQube Quality Gate..."
                    curl -s -u $SONAR_TOKEN: \
                    "http://4.213.97.72:9000/api/qualitygates/project_status?projectKey=todo-ui-devsecops" \
                    > sonar-quality-gate.json

                    echo "Fetching SonarQube Metrics..."
                    curl -s -u $SONAR_TOKEN: \
                    "http://4.213.97.72:9000/api/measures/component?component=todo-ui-devsecops&metricKeys=bugs,vulnerabilities,code_smells,coverage,duplicated_lines_density,ncloc" \
                    > sonar-metrics.json
                    '''
                }
            }
        }
        stage('Parse SonarQube Metrics') {
            steps {
                sh '''
                echo "Parsing SonarQube reports..."

                QUALITY_GATE=$(jq -r '.projectStatus.status' sonar-quality-gate.json)

                BUGS=$(jq -r '.component.measures[] | select(.metric=="bugs") | .value' sonar-metrics.json)
                VULNERABILITIES=$(jq -r '.component.measures[] | select(.metric=="vulnerabilities") | .value' sonar-metrics.json)
                CODE_SMELLS=$(jq -r '.component.measures[] | select(.metric=="code_smells") | .value' sonar-metrics.json)
                COVERAGE=$(jq -r '.component.measures[] | select(.metric=="coverage") | .value' sonar-metrics.json)
                DUPLICATION=$(jq -r '.component.measures[] | select(.metric=="duplicated_lines_density") | .value' sonar-metrics.json)
                LOC=$(jq -r '.component.measures[] | select(.metric=="ncloc") | .value' sonar-metrics.json)

                echo "QUALITY_GATE=$QUALITY_GATE" >> sonar-env.txt
                echo "BUGS=$BUGS" >> sonar-env.txt
                echo "VULNERABILITIES=$VULNERABILITIES" >> sonar-env.txt
                echo "CODE_SMELLS=$CODE_SMELLS" >> sonar-env.txt
                echo "COVERAGE=$COVERAGE" >> sonar-env.txt
                echo "DUPLICATION=$DUPLICATION" >> sonar-env.txt
                echo "LOC=$LOC" >> sonar-env.txt
                '''
            }
        }
    }

    post {
    always {
        echo "Cleaning up preview app..."
        sh 'pkill -f "npm run preview" || true'
        
        emailext(
    to: 'durveshsshendokar@gmail.com,khushwant.yadav@zionit.in,shivam.nishad@zionit.in,ashwini.gaikwad@zionit.in,avinash.d@zionit.in,divakar.barhate@zionit.in',
    from: 'durveshsshendokar@gmail.com',
    subject: "DevSecOps Pipeline Result: ${currentBuild.currentResult} | ${env.JOB_NAME} #${env.BUILD_NUMBER}",
    mimeType: 'text/html',
    body: """
    <html>
    <body style="font-family: Arial, sans-serif;">

    <h2 style="color:#2F80ED;">DevSecOps Pipeline Report</h2>

    <table cellpadding="6">
        <tr><td><b>Job</b></td><td>${env.JOB_NAME}</td></tr>
        <tr><td><b>Build Number</b></td><td>#${env.BUILD_NUMBER}</td></tr>
        <tr><td><b>Status</b></td><td><b>${currentBuild.currentResult}</b></td></tr>
        <tr><td><b>Triggered By</b></td><td>GitHub Push</td></tr>
    </table>

    <p>
        🔗 <b>Build URL:</b>
        <a href="${env.BUILD_URL}">${env.BUILD_URL}</a>
    </p>

    <hr/>

    <h3>📊 Security & Code Quality Reports</h3>
    <ul>
        <li>
            <b>SonarQube Quality Gate</b> →
            <a href="${env.BUILD_URL}artifact/sonar-quality-gate.json">View</a>
        </li>

        <li>
            <b>SonarQube Metrics</b> →
            <a href="${env.BUILD_URL}artifact/sonar-metrics.json">View</a>
        </li>

        <li>
            <b>OWASP ZAP DAST Report</b> →
            <a href="${env.BUILD_URL}artifact/zap-report.html">View</a>
        </li>
    </ul>

    <p style="color:gray; font-size:12px;">
        ⚠️ Large security reports are stored as Jenkins artifacts to avoid email size limitations.
    </p>

    <br/>
    <p style="color:#555;">
        — Jenkins DevSecOps Pipeline
    </p>

    </body>
    </html>
    """
)

        archiveArtifacts artifacts: '''
            zap-report.html,
            zap-warn.txt,
            zap-report.xml,
            sonar-quality-gate.json,
            sonar-metrics.json,
            sonar-env.txt
        ''', allowEmptyArchive: true
    }

        success {
            echo '✅ Pipeline completed successfully (SAST + DAST)'
        }

        failure {
            echo '❌ Pipeline failed (Security Quality Gate Violation)'
        }
    }
}
