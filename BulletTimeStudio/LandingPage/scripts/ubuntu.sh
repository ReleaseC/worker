scp -i /home/siiva/siiva-ai4ia.pem -r /var/lib/jenkins/workspace/dashboard root@103.56.118.154:/project
ssh -i /home/siiva/siiva-ai4ia.pem -o ConnectTimeout=300  root@103.56.118.154 "/project/buid.sh"