FROM registry.cn-shanghai.aliyuncs.com/c7n/frontbase:0.9.0

COPY ./build /usr/share/nginx/html/dist
COPY default.conf /etc/nginx/conf.d/
COPY enterpoint.sh /usr/share/nginx/
RUN ["chmod", "+x", "/usr/share/nginx/enterpoint.sh"]

ENTRYPOINT ["/usr/share/nginx/enterpoint.sh"]
CMD ["nginx", "-g", "daemon off;"]

EXPOSE 80