import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { SysDictService } from './sys-dict.service';
import {
  CreateSysDictDto,
  GetSysDictListDto,
  UpdateSysDictDto,
} from './dto/req-sys-dict.dto';
import { Permission } from '@/common/decorators/permission.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateDtoPipe } from '@/common/pipes/createDto.pipe';
import { UpdateDtoPipe } from '@/common/pipes/updateDto.pipe';

@ApiTags('用户字典')
@ApiBearerAuth()
@Controller('sys/dict')
export class SysDictController {
  constructor(private readonly sysDictService: SysDictService) {}

  @Permission('sys:dict:create')
  @Post()
  create(@Body(CreateDtoPipe) createSysDictDto: CreateSysDictDto) {
    return this.sysDictService.create(createSysDictDto);
  }

  @Permission('sys:dict:list')
  @Get()
  findAll(@Query() query: GetSysDictListDto) {
    return this.sysDictService.findAll(query);
  }

  @Permission('sys:dict:list')
  @Get('options')
  findAllOptions() {
    return this.sysDictService.findAllOptions();
  }

  @Permission('sys:dict:list')
  @Post('options')
  findDicts(@Body('codes') codes: string[]) {
    return this.sysDictService.findDicts(codes);
  }

  @Permission('sys:dict:list')
  @Get(':code')
  findOne(@Param('code') code: string) {
    return this.sysDictService.findOne(code);
  }

  @Permission('sys:dict:update')
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body(UpdateDtoPipe) updateSysDictDto: UpdateSysDictDto,
  ) {
    return this.sysDictService.update(id, updateSysDictDto);
  }

  @Permission('sys:dict:remove')
  @Delete()
  remove(@Body('codes') codes: string[]) {
    return this.sysDictService.remove(codes);
  }
}
