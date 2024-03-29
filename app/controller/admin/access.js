'use strict';

const BaseController = require('./base.js');

class AccessController extends BaseController {
  async index() {
    // var accessList=await this.ctx.model.Access.find({});
    // console.log(accessList);
    // 1、在access表中找出  module_id=0的数据        管理员管理 _id    权限管理 _id    角色管理  (模块)
    // 2、让access表和access表关联    条件：找出access表中  module_id等于_id的数据
    let accessList = await this.ctx.service.cache.get('accessList');
    if (!accessList) {
      accessList = await this.ctx.model.Access.aggregate([{
        $lookup: {
          from: 'access',
          localField: '_id',
          foreignField: 'module_id',
          as: 'items',
        },
      },
      {
        $match: {
          module_id: '0',
        },
      },
      ]);
      await this.ctx.service.cache.set('accessList', accessList, 60 * 60);
    }
    await this.ctx.render('admin/access/index', {
      accessList,
    });
  }

  async add() {
    const moduleList = await this.ctx.model.Access.find({
      module_id: '0',
    });
    await this.ctx.render('/admin/access/add', {
      moduleList,
    });
  }

  async doAdd() {
    const accessInfo = this.ctx.request.body;
    const module_id = accessInfo.module_id;
    if (module_id !== '0') {
      accessInfo.module_id = this.app.mongoose.Types.ObjectId(module_id); // 调用mongoose里面的方法把字符串转换成ObjectId
    }
    const access = await new this.ctx.model.Access(accessInfo);
    await access.save();
    await this.success('/admin/access', '增加权限成功');
  }

  async edit() {
    const moduleList = await this.ctx.model.Access.find({
      module_id: '0',
    });
    const _id = this.ctx.request.query._id;
    const accessInfo = (await this.ctx.model.Access.find({
      _id,
    }))[0];
    await this.ctx.render('/admin/access/edit', {
      moduleList,
      accessInfo,
    });
  }

  async doEdit() {
    const accessInfo = this.ctx.request.body;
    const _id = accessInfo._id;
    const module_id = accessInfo.module_id;
    if (module_id !== '0') {
      accessInfo.module_id = this.app.mongoose.Types.ObjectId(module_id); // 调用mongoose里面的方法把字符串转换成ObjectId
    }
    await this.ctx.model.Access.updateOne({
      _id,
    }, accessInfo);
    await this.success('/admin/access', '编辑权限成功');
  }
}

module.exports = AccessController;
