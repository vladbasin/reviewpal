FROM public.ecr.aws/bitnami/node:18
WORKDIR /app
COPY ./dist/apps/reviewpal-be .
EXPOSE 3000
CMD ["node", "main.js"]
