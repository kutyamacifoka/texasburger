async getBgImages() {
    try {
      let contentful = await client.getEntries({
        content_type: "texasBurger",
      });

      let bgImages = await contentful.items;
      bgImages = bgImages
        .filter((item) => {
          for (let i = 0; i < bgImages.length; i++) {
            if (item.fields.class[i] === "large-image") {
              return item;
            }
          }
        })
        .map((item) => {
          const { title } = item.fields;
          const itemClass = [item.fields.class];
          const image = item.fields.image.fields.file.url;
          return { title, itemClass, image };
        });

      return bgImages;
    } catch (error) {
      console.log(error);
    }
  }