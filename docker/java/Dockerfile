FROM itzg/minecraft-server:multiarch

LABEL maintainer "NN708"

RUN apk add nodejs npm && \
  npm install -g mcrepeater

ENTRYPOINT [ "mcrepeater" ]