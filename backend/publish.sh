docker build . -t cs3365-mbs-backend:latest
docker image tag cs3365-mbs-backend:latest ghcr.io/jaxcksn/cs3365-mbs-backend:latest
docker push ghcr.io/jaxcksn/cs3365-mbs-backend:latest