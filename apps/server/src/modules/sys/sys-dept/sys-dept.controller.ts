import { Permission } from '@/common/decorators/permission.decorator';
import { CreateDtoPipe } from '@/common/pipes/createDto.pipe';
import { UpdateDtoPipe } from '@/common/pipes/updateDto.pipe';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import {
  CreateSysDeptDto,
  GetSysDeptListDto,
  UpdateSysDeptDto,
} from './dto/req-sys-dept.dto';
import { SysDeptService } from './sys-dept.service';

@ApiTags('部门')
@ApiBearerAuth()
@Controller('sys/dept')
export class SysDeptController {
  constructor(private readonly sysDeptService: SysDeptService) {}
  /* 新增 */
  @Post()
  @ApiOperation({
    summary: '新增部门',
  })
  @Permission('sys:dept:create')
  async create(@Body(CreateDtoPipe) createSysDeptDto: CreateSysDeptDto) {
    return this.sysDeptService.create(createSysDeptDto);
  }

  /* 列表查询 */
  @Get()
  @ApiOperation({
    summary: '查询部门列表',
  })
  @Permission('sys:dept:list')
  async findAll(@Query() getSysDeptListDto: GetSysDeptListDto) {
    return this.sysDeptService.findAll(getSysDeptListDto);
  }

  /* 通过id查询 */
  @Get(':id')
  @ApiOperation({
    summary: '查询部门详情',
  })
  @ApiParam({ name: 'id', description: '部门id' })
  @Permission('sys:dept:detail')
  async findOne(@Param('id') id: string) {
    return await this.sysDeptService.findOne(id);
  }

  /* 更新 */
  @Patch(':id')
  @ApiOperation({
    summary: '更新部门',
  })
  @ApiParam({ name: 'id', description: '部门id' })
  @Permission('sys:dept:update')
  async update(
    @Param('id') id: string,
    @Body(UpdateDtoPipe) updateSysDeptDto: UpdateSysDeptDto,
  ) {
    return this.sysDeptService.update(id, updateSysDeptDto);
  }

  /* 单个删除 */
  @Delete(':id')
  @ApiOperation({
    summary: '删除部门',
  })
  @ApiParam({ name: 'id', description: '部门id' })
  @Permission('sys:dept:remove')
  async remove(@Param('id') id: string) {
    return this.sysDeptService.remove(id);
  }

  /* 批量删除 */
  @Delete()
  @ApiOperation({
    summary: '批量删除部门',
  })
  @Permission('sys:dept:removes')
  async removes(@Body('ids') ids: string[]) {
    return this.sysDeptService.removes(ids);
  }
}
