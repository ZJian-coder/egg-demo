'use strict';

const fs = require('fs');

const BaseController = require('./base.js');
class GoodsCateController extends BaseController {
  async index() {
    const result = await this.ctx.model.GoodsCate.aggregate([{
      $lookup: {
        from: 'goods_cate',
        localField: '_id',
        foreignField: 'pid',
        as: 'items',
      },
    },
    {
      $match: {
        pid: '0',
      },
    },

    ]);
    await this.ctx.render('admin/goodsCate/index', {
      list: result,
    });
  }
  async add() {
    const result = await this.ctx.model.GoodsCate.find({
      pid: '0',
    });
    await this.ctx.render('admin/goodsCate/add', {
      cateList: result,
    });

  }

  async doAdd() {
    const file = this.ctx.request.files[0];
    const fileInfo = await this.service.tools.getUploadFile(file.filepath);
    try {
      // 处理文件
      fs.createReadStream(file.filepath).pipe(fs.createWriteStream(fileInfo.uploadDir));
    } finally {
      // 需要删除临时文件
      await fs.unlink(file.filepath);
    }
    // 生产缩略图
    await this.ctx.service.tools.jimpImg(fileInfo.uploadDir);
    const fileField = this.ctx.request.body;
    fileField.cate_img = fileInfo.saveDir;
    if (fileField.pid !== '0') {
      fileField.pid = this.app.mongoose.Types.ObjectId(fileField.pid); // 调用mongoose里面的方法把字符串转换成ObjectId
    }
    const saveGoodsCate = new this.ctx.model.GoodsCate(fileField);
    await saveGoodsCate.save();
    await this.success('/admin/goodsCate', '增加分类成功');

  }

}
module.exports = GoodsCateController;
